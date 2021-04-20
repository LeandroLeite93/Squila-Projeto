import Contact from '@schemas/Contacts';
import Tag from '@schemas/Tag';
import ImportContactsService from '@services/ImportContactsService';
import { Readable } from 'stream';





describe('Import', () => {
    beforeAll(async () => {
        if(!process.env.MONGO_URL) {
            throw new Error('mongoDB server not initialized');
        }
    });

    afterAll(async () => {
        await Contact.deteteMany({});
        await Tag.deleteMany({});
    });

    beforeEach(async () => {
        await Contact.deleteMany({});
        await Tag.deleteMany({});
    });

        it('should be abe to import new Contact', async () => {
            const contactsFileStream = Readable.from([
            'leandro1.pl@blind.com\n',
            'leticiaswt.ty@gmail.com\n',
            'michel@pinheiro.com.br\n',
            ]);

            const importContact = new ImportContactsService(); 

            await importContact.run(contactsFileStream, ['Students', 'Class A']);

            const createdTags = await Tag.find({}).lean(); 

            expect(createdTags).toEqual([
                expect.objectContaining({ title: 'Students' }),
                expect.objectContaining({ title: 'Class A' }),
            ]);

            const createdTagsIds = createdTags.map(tag =>tag._id);

            const createdContacts = await Contact.find({});

            expect(createdContacts).toEqual([
                expect.objectContaining({
                    email: 'leandro1.pl@blind.com',
                    tags: createdTagsIds,
                }),

                expect.objectContaining({
                   email: 'leticiaswt.ty@gmail.com',
                   tags: createdTagsIds,
                }),

                expect.objectContaining({
                    email: 'michel@pinheiro.com.br',
                    tags: createdTagsIds, 
                }),
            ]),
        });

    it('should not recreate tags that alread exists', async() => {
        const contactsFileStream = Readable.from([
            'leandro1.pl@blind.com\n',
            'leticiaswt.ty@gmail.com\n',
            'michel@pinheiro.com.br\n',
        ]);
      
        const importContact = new ImportContactsService();

        await Tag.create({ title: 'Students' });

        await importContact.run(contactsFileStream, ['Students', 'Class A']);

        const createdTags = await Tag.find({}).lean();

        expect(createTags).toEqual([
    expect.objectContaining({ title: 'Students'}),
    expect.objectContaining({ title: 'Class A'}),
        ])

    });

   it('should not recreate contacts that already exists', async () => {
    const contactsFileStream = Readable.from([
        'leandro1.pl@blind.com\n',
        'leticiaswt.ty@gmail.com\n',
        'michel@pinheiro.com.br\n',
    ]);

  const importContact = new ImportContactsService();

  const Tag = await Tag.create({ title: 'Students' });
  await Contact.create({ email: 'leandro1pl@blind.com', tags: [tag._id] });

  await importContact.run(contactsFileStream, ['Classe A']); 
  
  const contacts = await Contact.find({
    email: 'leandro1pl@blind.com', 
  })
  .populate('tags')
  .lean();

  expect(contacts.legth).toBe(1)
  expect(contacts[0].tags).toEqual([
      expect.objectContaining({ title: 'Students' }),
      expect.objectContaining({ title: 'Class A' }),
  ]);
   });
});