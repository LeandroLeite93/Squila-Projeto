import Contact from '@Schemas/Contact';
import Tag from '@Schemas/Tag';
import csvParse from 'csv-parse';
import { Readable } from 'stream';


class ImportContactsService {
    async run(contactsFileStream: Readable, tags: string[]): Promise<void> {
    const parsers = csvParse({
        delimiter: ';',
    });

    const parseCSV = contactsFileStream.pipe(parsers);
     
    const existentData = await Tag.find({
        title: {
        $in: tags,
        },
    });

    const existentTagsTitles = existentData.map(tag => tag.title);

    const newTagsDate = tags 
    .filter(tag => !existentTagsTitles.include(tag))
    .map(tag => ({ title: tag }));

   const createdTags = await Tag.create(newTagsDate);
   const tagsIds = createdTags.map(tag => tag._id);

   parseCSV.on('data', async line => {
       const [email] = line;

   await Contact.findOneAndUpdate(
       { email },
       { $addToSet: { tags: tagsIds } },
       { upsert: true },
   );
});
 
   await new Promise(resolve => parseCSV.on('end', resolve));

    }
}

export default ImportContactsService;