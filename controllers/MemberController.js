const Member = require('../models/MemberModel');

exports.getAllMember = async (req, res) => {
  try {
    const members = await Member.findAll();
    res.status(200).json(members);
  } catch (error) {
    console.error("Error getting members:", error);
    res.status(500).json({ message: 'خطأ في جلب الأعضاء' });
  }
};

exports.createMember = async (req, res) => {
  try {
    const { name, job, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !job || !description || !imageUrl) {
      return res.status(400).json({ message: 'كل الحقول مطلوبة' });
    }

    const newMember = await Member.create({
      name,
      job,
      description,
      imageUrl,
    });

    res.status(201).json(newMember);
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ message: 'خطأ في إنشاء العضو' });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByPk(id);

    if (!member) {
      return res.status(404).json({ message: 'العضو غير موجود' });
    }

    await member.destroy();
    res.status(200).json({ message: 'تم حذف العضو بنجاح' });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: 'خطأ في حذف العضو' });
  }
};
