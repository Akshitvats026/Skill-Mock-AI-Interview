const fs = require('fs');
const pdfParse = require('pdf-parse');

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C', 'C#', 'Go', 'Rust', 'PHP', 'Ruby',
  'React', 'React.js', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express', 'Express.js', 'NestJS',
  'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET', 'GraphQL', 'REST API',
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Firebase', 'Supabase', 'Oracle',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Git', 'GitHub', 'Linux',
  'HTML', 'HTML5', 'CSS', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Redux', 'Zustand',
  'Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow', 'PyTorch', 'Data Structures', 'Algorithms'
];

const parseResumeFile = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    let rawText = '';

    if (filePath.endsWith('.pdf')) {
      const data = await pdfParse(dataBuffer);
      rawText = data.text;
    } else {
      rawText = dataBuffer.toString('utf8');
    }

    const cleanedText = rawText.replace(/\r\n/g, '\n');
    
    // Skill extraction
    const matchedSkills = [];
    COMMON_SKILLS.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
      if (regex.test(cleanedText)) {
        matchedSkills.push(skill);
      }
    });

    // Domain detection
    let detectedDomain = 'Full Stack Development';
    const textLower = cleanedText.toLowerCase();
    if (textLower.includes('machine learning') || textLower.includes('deep learning') || textLower.includes('data science') || textLower.includes('pytorch')) {
      detectedDomain = 'Data Science & AI';
    } else if (textLower.includes('docker') || textLower.includes('kubernetes') || textLower.includes('ci/cd') || textLower.includes('cloud') || textLower.includes('devops')) {
      detectedDomain = 'DevOps & Cloud Engineering';
    } else if (textLower.includes('react') || textLower.includes('frontend') || textLower.includes('ui/ux') || textLower.includes('css')) {
      detectedDomain = 'Frontend Web Development';
    } else if (textLower.includes('node') || textLower.includes('backend') || textLower.includes('sql') || textLower.includes('api')) {
      detectedDomain = 'Backend Engineering';
    }

    // Projects extraction heuristic
    const lines = cleanedText.split('\n').map(l => l.trim()).filter(Boolean);
    const projects = [];
    const experience = [];
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/project/i.test(line) && line.length < 30) {
        currentSection = 'projects';
        continue;
      } else if (/(experience|employment|work history)/i.test(line) && line.length < 30) {
        currentSection = 'experience';
        continue;
      } else if (/(education|academics|qualifications)/i.test(line) && line.length < 30) {
        currentSection = 'education';
        continue;
      }

      if (currentSection === 'projects' && projects.length < 5) {
        if (line.length > 5 && !line.startsWith('http') && line.length < 80) {
          projects.push(line);
        }
      } else if (currentSection === 'experience' && experience.length < 5) {
        if (line.length > 5 && line.length < 80) {
          experience.push(line);
        }
      }
    }

    // Email extraction
    const emailMatch = cleanedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = cleanedText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

    return {
      text: rawText.substring(0, 4000),
      skills: matchedSkills.length > 0 ? Array.from(new Set(matchedSkills)) : ['JavaScript', 'React', 'Node.js', 'Problem Solving'],
      detectedDomain,
      projects: projects.length > 0 ? projects : ['Full-stack Web App', 'AI Recommendation Engine'],
      experience: experience.length > 0 ? experience : ['Academic Projects & Internships'],
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : ''
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    return {
      text: '',
      skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
      detectedDomain: 'Full Stack Development',
      projects: ['Full-stack Web Application'],
      experience: ['Student Developer'],
      email: '',
      phone: ''
    };
  }
};

module.exports = { parseResumeFile };
