/**
 * First Aid Data Tests
 * Testing critical emergency guide data structure and functions
 */

import {
  firstAidGuides,
  getFirstAidGuide,
  getFirstAidByCategory,
  getFirstAidByEmergencyLevel,
  searchFirstAidGuides,
} from '../../src/data/firstAidData';

describe('First Aid Data', () => {
  describe('Data Integrity', () => {
    test('should have 7 first aid guides', () => {
      expect(firstAidGuides).toHaveLength(7);
    });

    test('all guides should have required fields', () => {
      firstAidGuides.forEach((guide) => {
        expect(guide).toHaveProperty('id');
        expect(guide).toHaveProperty('title');
        expect(guide).toHaveProperty('steps');
        expect(guide).toHaveProperty('doNots');
        expect(guide).toHaveProperty('emergency');
        expect(guide.steps.length).toBeGreaterThan(0);
      });
    });

    test('all steps should have step numbers in sequence', () => {
      firstAidGuides.forEach((guide) => {
        guide.steps.forEach((step, index) => {
          expect(step.stepNumber).toBe(index + 1);
        });
      });
    });

    test('critical steps should be flagged', () => {
      const cprGuide = firstAidGuides.find((g) => g.id === 'cpr-infant-0-12');
      expect(cprGuide).toBeDefined();
      const criticalSteps = cprGuide!.steps.filter((s) => s.criticalStep);
      expect(criticalSteps.length).toBeGreaterThan(0);
    });

    test('all guides should have emergency contacts', () => {
      firstAidGuides.forEach((guide) => {
        expect(guide.emergencyContacts).toBeDefined();
        expect(guide.emergencyContacts.length).toBeGreaterThan(0);
        // Check 112 is present
        const has112 = guide.emergencyContacts.some((c) => c.number === '112');
        expect(has112).toBe(true);
      });
    });
  });

  describe('getFirstAidGuide', () => {
    test('should return guide by valid ID', () => {
      const guide = getFirstAidGuide('choking-infant-0-12');
      expect(guide).toBeDefined();
      expect(guide?.title).toContain('Boğulma');
    });

    test('should return undefined for invalid ID', () => {
      const guide = getFirstAidGuide('non-existent-id');
      expect(guide).toBeUndefined();
    });
  });

  describe('getFirstAidByCategory', () => {
    test('should return guides by category "acil"', () => {
      const guides = getFirstAidByCategory('acil');
      expect(guides.length).toBeGreaterThan(0);
      guides.forEach((guide) => {
        expect(guide.category).toBe('acil');
      });
    });

    test('should return guides by category "yaralanma"', () => {
      const guides = getFirstAidByCategory('yaralanma');
      expect(guides.length).toBeGreaterThan(0);
      guides.forEach((guide) => {
        expect(guide.category).toBe('yaralanma');
      });
    });
  });

  describe('getFirstAidByEmergencyLevel', () => {
    test('should return life-threatening guides', () => {
      const guides = getFirstAidByEmergencyLevel('life-threatening');
      expect(guides.length).toBeGreaterThan(0);
      guides.forEach((guide) => {
        expect(guide.emergency).toBe('life-threatening');
      });
    });

    test('should return urgent guides', () => {
      const guides = getFirstAidByEmergencyLevel('urgent');
      expect(guides.length).toBeGreaterThan(0);
      guides.forEach((guide) => {
        expect(guide.emergency).toBe('urgent');
      });
    });
  });

  describe('searchFirstAidGuides', () => {
    test('should find guides by title keyword', () => {
      const results = searchFirstAidGuides('boğulma');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain('Boğulma');
    });

    test('should find guides by quickSummary', () => {
      const results = searchFirstAidGuides('CPR');
      expect(results.length).toBeGreaterThan(0);
    });

    test('should return empty array for non-matching search', () => {
      const results = searchFirstAidGuides('xyz123nonexistent');
      expect(results).toHaveLength(0);
    });

    test('should be case insensitive', () => {
      const results1 = searchFirstAidGuides('BOĞULMA');
      const results2 = searchFirstAidGuides('boğulma');
      expect(results1.length).toBe(results2.length);
    });
  });

  describe('Medical Accuracy Checks', () => {
    test('CPR guide should have correct compression-breath ratio', () => {
      const cprGuide = getFirstAidGuide('cpr-infant-0-12');
      expect(cprGuide).toBeDefined();
      // Check for 30:2 ratio in steps
      const ratioMentioned = cprGuide!.steps.some(
        (step) =>
          step.title.includes('30') || step.instruction.includes('30 göğüs')
      );
      expect(ratioMentioned).toBe(true);
    });

    test('Fever guide should warn against aspirin', () => {
      const feverGuide = getFirstAidGuide('high-fever-infant-0-24');
      expect(feverGuide).toBeDefined();
      const aspirinWarning = feverGuide!.doNots.some((dont) =>
        dont.toLowerCase().replace(/i̇/g, 'i').includes('aspirin')
      );
      expect(aspirinWarning).toBe(true);
    });

    test('Burns guide should warn against ice', () => {
      const burnsGuide = getFirstAidGuide('burns-treatment-0-24');
      expect(burnsGuide).toBeDefined();
      const iceWarning = burnsGuide!.doNots.some((dont) =>
        dont.toLowerCase().includes('buz')
      );
      expect(iceWarning).toBe(true);
    });

    test('Poisoning guide should include 114 number', () => {
      const poisonGuide = getFirstAidGuide('poisoning-infant-0-24');
      expect(poisonGuide).toBeDefined();
      const has114 = poisonGuide!.emergencyContacts.some(
        (c) => c.number === '114'
      );
      expect(has114).toBe(true);
    });
  });

  describe('Metadata Validation', () => {
    test('all guides should have recent update dates', () => {
      firstAidGuides.forEach((guide) => {
        expect(guide.metadata.lastUpdated).toBeDefined();
        // Check date format YYYY-MM-DD
        expect(guide.metadata.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    test('all guides should cite sources', () => {
      firstAidGuides.forEach((guide) => {
        expect(guide.metadata.source).toBeDefined();
        expect(guide.metadata.source.length).toBeGreaterThan(0);
      });
    });
  });
});
