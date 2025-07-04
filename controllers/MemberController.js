const Member = require('../models/MemberModel');

const getAllMember = async (req, res) => {
  try {
    const members = await Member.findAll();
    res.status(200).json(members);
  } catch (error) {
    console.error("Error getting members:", error);
    res.status(500).json({ message: 'خطأ في جلب الأعضاء' });
  }
};

const createMember = async (req, res) => {
  try {
    const { name, role, bio } = req.body;
    const image = req.file ? `/uploads/members/${req.file.filename}` : null;

    if (!name || !role || !bio || !image) {
      return res.status(400).json({ message: 'كل الحقول مطلوبة' });
    }

    const newMember = await Member.create({
      name,
      role,
      bio,
      image,
    });

    res.status(201).json(newMember);
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ message: 'خطأ في إنشاء العضو' });
  }
};

const deleteMember = async (req, res) => {
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


module.exports = {
  getAllMember,
  createMember,
  deleteMember,
};
