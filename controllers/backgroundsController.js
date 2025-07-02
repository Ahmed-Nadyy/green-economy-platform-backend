const { Background, SectionSelection } = require('../models');

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
      backgroundsBySection[bg.section].push(bg);
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

exports.addBackground = async (req, res) => {
  const { section, url } = req.body;
  if (!section || !url) return res.status(400).json({ error: 'Missing data' });

  try {
    const newBg = await Background.create({ section, url });
    res.json({ success: true, background: newBg });
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
    res.status(500).json({ error: 'Server error' });
  }
};
