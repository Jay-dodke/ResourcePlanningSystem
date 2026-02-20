import Skill from "../modules/skills/skill.model.js";

const skillData = [
  {name: "React", category: "Frontend"},
  {name: "Angular", category: "Frontend"},
  {name: "Vue.js", category: "Frontend"},
  {name: "Next.js", category: "Frontend"},
  {name: "Node.js", category: "Backend"},
  {name: "Express", category: "Backend"},
  {name: "Java", category: "Backend"},
  {name: "Spring Boot", category: "Backend"},
  {name: "C#", category: "Backend"},
  {name: ".NET", category: "Backend"},
  {name: "Python", category: "Backend"},
  {name: "Django", category: "Backend"},
  {name: "SQL", category: "Database"},
  {name: "PostgreSQL", category: "Database"},
  {name: "MongoDB", category: "Database"},
  {name: "QA", category: "Quality"},
  {name: "Selenium", category: "Quality"},
  {name: "Cypress", category: "Quality"},
  {name: "Playwright", category: "Quality"},
  {name: "Jest", category: "Quality"},
  {name: "AWS", category: "DevOps"},
  {name: "Azure", category: "DevOps"},
  {name: "Docker", category: "DevOps"},
  {name: "Kubernetes", category: "DevOps"},
  {name: "Terraform", category: "DevOps"},
  {name: "Figma", category: "Design"},
  {name: "UX Research", category: "Design"},
  {name: "UI Design", category: "Design"},
  {name: "Planning", category: "Management"},
  {name: "Agile", category: "Management"},
  {name: "Scrum", category: "Management"},
  {name: "Jira", category: "Management"},
  {name: "IT Support", category: "Support"},
  {name: "Networking", category: "Support"},
];

export const getSeedSkills = () => skillData;

export const seedSkills = async () => {
  const skills = [];
  for (const data of skillData) {
    const skill = await Skill.findOneAndUpdate({name: data.name}, data, {new: true, upsert: true});
    skills.push(skill);
  }
  return skills;
};
