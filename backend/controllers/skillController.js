import Skill from "../models/Skills.js";


// 🔹 Get skill suggestions
export const getSkills = async (req, res) => {

  try {

    const search = req.query.search || "";

    const skills = await Skill.find({
      name: { $regex: search, $options: "i" }
    }).limit(10);

    res.status(200).json(skills);

  }
  catch (error) {

    res.status(500).json({
      message: "Failed to fetch skills",
      error: error.message
    });

  }

};


// 🔹 Add new skill
export const addSkill = async (req, res) => {

  try {

    const { name } = req.body;

    const skill = await Skill.create({ name });

    res.status(201).json(skill);

  }
  catch (error) {

    res.status(400).json({
      message: "Skill already exists or invalid data",
      error: error.message
    });

  }

};
