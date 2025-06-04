const Slide = require("../models/Slide");

class slideController {
  async addSlide(req, res) {
    const { title, description, buttonText, isVideo } = req.body;
    try {
      const newSlide = new Slide({
        title,
        description,
        buttonText,
        isVideo,
      });

      if (req?.file?.path) {
        newSlide.srcUrl = req?.file?.path;
      }

      await newSlide.save();
      return res.status(200).json({ message: "Слайд успешно добавлен", slide: newSlide });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Ошибка при добавлении слайда" });
    }
  }

  async getSlides(req, res) {
    try {
      const slides = await Slide.find();
      res.status(200).json(slides);
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Ошибка при попытке получить слайды" });
    }
  }

  async getSlide(req, res) {
    try {
      const { id } = req.params;
      const slide = await Slide.findOne({ _id: id });
      if (!slide) {
        return res.status(404).json({ message: "Слайд не найден" });
      }
      res.status(200).json(slide);
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Ошибка при попытке получить данные слайда" });
    }
  }

  async changeSlide(req, res) {
    try {
      const { id } = req.params;
      const { title, description, buttonText, isVideo } = req.body;
      let updateData = { title, description, buttonText, isVideo: isVideo === 'true' };

      if (req.files && req.files.length > 0) {
        updateData[isVideo === 'true' ? 'video' : 'image'] = req.files[0].path;
      }

      const slide = await Slide.findByIdAndUpdate(id, updateData, { new: true });
      if (!slide) {
        return res.status(404).json({ message: "Слайд не найден" });
      }

      return res.status(200).json({ message: "Слайд успешно изменен", slide });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Ошибка при попытке изменить данные слайда" });
    }
  }

  async deleteSlide(req, res) {
    try {
      const { id } = req.params;
      const slide = await Slide.findByIdAndDelete(id);
      if (!slide) {
        return res.status(404).json({ message: "Слайд не найден" });
      }
      res.status(200).json({ message: "Слайд успешно удален" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Ошибка при удалении слайда" });
    }
  }
}

module.exports = new slideController();