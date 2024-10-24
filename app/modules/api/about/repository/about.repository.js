const About = require("../model/about");

class AboutRepository {
    allabout = async () => {
        return await About.find();
    };
    getAbout = async () => {
        return await About.findOne();
    };

    updateAbout = async (data) => {
        let about = await About.findOne();

        if (about) {
            about.title = data.title;
            about.description = data.description;
            if (data.aboutimage) {
                about.aboutimage = data.aboutimage;
            }
            return await about.save();
        } else {
            about = new About({
                title: data.title,
                description: data.description,
                aboutimage: data.aboutimage,
            });
            return await about.save();
        }
    };
}

module.exports = new AboutRepository();
