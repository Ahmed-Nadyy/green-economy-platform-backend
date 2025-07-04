const { Background, SectionSelection } = require('../models');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Op, Sequelize } = require('sequelize');
// إعدادات multer لتخزين الصور في مجلد 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/backgrounds';
    // تأكد من وجود المجلد
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// استخدام upload.single() في المسار الخاص بـ POST لتخزين الملف
exports.addBackground = [
  upload.single('image'), // اسم الحقل في الفورم سيكون 'image'
  async (req, res) => {
    const { section } = req.body;
    const file = req.file;

    if (!section || !file) {
      return res.status(400).json({ error: 'Missing data or file' });
    }

    try {
      const url = `/uploads/backgrounds/${file.filename}`; // مسار الصورة الجديد
      const newBg = await Background.create({ section, url });

      res.json({ success: true, background: newBg });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
];

exports.getAllBackgrounds = async (req, res) => {
  try {
    const backgrounds = await Background.findAll();
    const selections = await SectionSelection.findAll({
      include: [{ model: Background, as: 'selectedBackground' }]
    });

    // تنظيم الخلفيات حسب القسم
    const backgroundsBySection = {
      platform: [],
      institutionWord: [],
      gallery: [],
    };

    backgrounds.forEach(bg => {
      // تحقق من أن القسم موجود في backgroundsBySection قبل محاولة الإضافة
      if (backgroundsBySection[bg.section]) {
        backgroundsBySection[bg.section].push(bg);
      } else {
        // إذا لم يكن القسم موجودًا، قم بإنشاء مصفوفة جديدة له
        backgroundsBySection[bg.section] = [bg];
      }
    });

    // تنظيم الاختيارات حسب القسم
    const selectedBackgrounds = {};
    selections.forEach(sel => {
      selectedBackgrounds[sel.section] = sel.selectedBackground ? sel.selectedBackground.id : null;
    });

    res.json({ backgroundsBySection, selectedBackgrounds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteBackground = async (req, res) => {
  const { id } = req.params;

  try {
    const bg = await Background.findByPk(id);
    if (!bg) return res.status(404).json({ error: 'Background not found' });

    // إزالة الخلفية من الاختيارات إذا مستخدمة
    await SectionSelection.update({ backgroundId: null }, { where: { backgroundId: id } });

    // احذف الصورة من النظام المحلي
    const filePath = `.${bg.url}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // حذف الصورة من النظام المحلي
    }

    await bg.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.selectBackground = async (req, res) => {
  const { section, backgroundId } = req.body;
  if (!section || !backgroundId) return res.status(400).json({ error: 'Missing data' });

  try {
    let selection = await SectionSelection.findOne({ where: { section } });
    if (!selection) {
      selection = await SectionSelection.create({ section, backgroundId });
    } else {
      selection.backgroundId = backgroundId;
      await selection.save();
    }
    res.json({ success: true, selection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSection = async (req, res) => {
  const { sections } = req.body; 

  // Check if sections are provided and are an array
  if (!sections || !Array.isArray(sections)) {
    return res.status(400).json({ error: 'Invalid or missing "sections" parameter' });
  }

  try {
    // Fetch section selection based on the sections array
    const sectionSelection = await SectionSelection.findAll({
      where: {
        section: {
          [Sequelize.Op.in]: sections  
        }
      }
    });

    // Fetch all background records
    const backgrounds = await Background.findAll({});

    // Assuming sectionSelection is an array of results, you should loop over them
    const result = sectionSelection.map((selection) => {
      // Find background that matches the backgroundId from sectionSelection
      return backgrounds.find((bac) => bac.id === selection.backgroundId);
    });

    // Return result with found background(s)
    res.json({
      message: 'Backgrounds fetched successfully.',
      data: result
    });

  } catch (error) {
    console.error('Error fetching backgrounds:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
