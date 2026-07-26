import { motion } from 'motion/react';

interface Skill {
  category: string;
  items: {
    name: string;
    specification: string;
    proficiency: number;
  }[];
}

const skills: Skill[] = [
  {
    category: 'CAD & MODELING',
    items: [
      { name: 'SolidWorks', specification: 'CSWA Certified', proficiency: 95 },
      { name: 'Fusion 360', specification: '3D CAD', proficiency: 88 },
      { name: 'AutoCAD', specification: '2D/3D Drafting', proficiency: 92 }
    ]
  },
  {
    category: 'ANALYSIS & SIMULATION',
    items: [
      { name: 'ANSYS FEA', specification: 'Structural/Thermal', proficiency: 85 },
      { name: 'CFD Analysis', specification: 'Fluid Dynamics', proficiency: 78 },
      { name: 'Motion Simulation', specification: 'Kinematic', proficiency: 82 }
    ]
  },
  {
    category: 'MANUFACTURING',
    items: [
      { name: 'CNC/Traditional Machining', specification: 'Mill/Lathe', proficiency: 90 },
      { name: 'GD&T', specification: 'ASME Y14.5', proficiency: 93 },
      { name: 'Sheet Metal', specification: 'Fabrication', proficiency: 87 }
    ]
  },
  {
    category: 'TECHNICAL',
    items: [
      { name: 'Python', specification: 'Programming (see projects above)', proficiency: 86 },
      { name: 'MATLAB', specification: 'Simulation', proficiency: 80 },
      { name: 'Git', specification: 'Version Control', proficiency: 84 }
    ]
  }
];

export function SkillsSection() {
  return (
    <section className="py-20 px-8 bg-black/30">
      <div className="max-w-6xl mx-auto">
        <div className="border-2 border-gray-700 p-8">
          {/* Material Spec Sheet Header */}
          <div className="border-b-2 border-gray-700 pb-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl text-white mb-2">TECHNICAL SPECIFICATIONS</h2>
                <div className="text-sm text-gray-500">SKILLS & COMPETENCIES</div>
              </div>
              <div className="text-right text-xs text-gray-600 space-y-1">
                <div>DOC NO: ENG-SPEC-001</div>
                <div>REV: 2026.05</div>
                <div>STATUS: CURRENT</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-gray-500">PREPARED BY</div>
                <div className="text-white">Rohan Singh</div>
              </div>
              <div>
                <div className="text-gray-500">DATE</div>
                <div className="text-white">2026-05-06</div>
              </div>
              <div>
                <div className="text-gray-500">STANDARD</div>
                <div className="text-white">ISO 9001</div>
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skillGroup, idx) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-4"
              >
                <div className="border-b border-gray-700 pb-2">
                  <h3 className="text-sm text-gray-400 uppercase tracking-wider">
                    {skillGroup.category}
                  </h3>
                </div>

                <div className="space-y-2">
                  {skillGroup.items.map((skill, skillIdx) => (
                    <div key={skill.name} className="text-sm">
                      <div className="text-white">{skill.name}</div>
                      <div className="text-xs text-gray-600">{skill.specification}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Notes */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="text-xs text-gray-600 space-y-1">
              <div>NOTES:</div>
              <div>1. All certifications current as of revision date.</div>
              <div>2. Additional documentation available upon request.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
