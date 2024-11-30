const buildMatchingScholarships = require('../../src/utils/buildMatchingScholarships');

describe('buildMatchingScholarships', () => {
  const baseUser = {
    major: 'Computer Science',
    totalGPA: 3.8,
    lastGPA: 3.9,
    currentSemester: 4,
    birthday: new Date('2000-01-01'),
    region: 'Seoul',
    incomeLevel: 2,
  };

  const today = new Date();

  const baseScholarship = {
    eligibleMajors: ['Computer Science', 'Mathematics'],
    minimumGPARequirement: 3.5,
    compTotalGPA: true,
    eligibleSemesters: [3, 4, 5],
    ageLimit: 25,
    regionalRestrictions: ['Seoul', 'Busan'],
    incomeLevelRequirement: 3,
    applicationPeriod: `${today.toISOString().split('T')[0]} ~ ${new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()).toISOString().split('T')[0]}`,
  };

  it('should return true when all conditions are met', () => {
    const matcher = buildMatchingScholarships(baseUser);
    expect(matcher(baseScholarship)).toBe(true);
  });

  it('should return false when major does not match', () => {
    const user = { ...baseUser, major: 'History' };
    const matcher = buildMatchingScholarships(user);
    expect(matcher(baseScholarship)).toBe(false);
  });

  it('should return true when minimumGPARequirement is null ', () => {
    const scholarship = { ...baseScholarship, minimumGPARequirement:null };
    const matcher = buildMatchingScholarships(baseUser);
    expect(matcher(scholarship)).toBe(true);
  });

  it('should return true when compare lastGPA ', () => {
    const scholarship = { ...baseScholarship, compTotalGPA:false };
    const matcher = buildMatchingScholarships(baseUser);
    expect(matcher(scholarship)).toBe(true);
  });

  it('should return false when GPA is below requirement', () => {
    const user = { ...baseUser, totalGPA: 3.0 };
    const matcher = buildMatchingScholarships(user);
    expect(matcher(baseScholarship)).toBe(false);
  });

  it('should return false when current semester is not eligible', () => {
    const user = { ...baseUser, currentSemester: 2 };
    const matcher = buildMatchingScholarships(user);
    expect(matcher(baseScholarship)).toBe(false);
  });

  it('should return false when age exceeds limit', () => {
    const user = { ...baseUser, birthday: new Date('1990-01-01') };
    const matcher = buildMatchingScholarships(user);
    expect(matcher(baseScholarship)).toBe(false);
  });

  it('should return false when region does not match', () => {
    const user = { ...baseUser, region: 'Incheon' };
    const matcher = buildMatchingScholarships(user);
    expect(matcher(baseScholarship)).toBe(false);
  });

  it('should return false when income level is too high', () => {
    const user = { ...baseUser, incomeLevel: 4 };
    const matcher = buildMatchingScholarships(user);
    expect(matcher(baseScholarship)).toBe(false);
  });

  it('should return false when application period has ended', () => {
    const scholarship = { ...baseScholarship, applicationPeriod: '2022-01-01 ~ 2022-12-31' };
    const matcher = buildMatchingScholarships(baseUser);
    expect(matcher(scholarship)).toBe(false);
  });

  it('should return false when application period is missing', () => {
    const scholarship = { ...baseScholarship, applicationPeriod: null };
    const matcher = buildMatchingScholarships(baseUser);
    expect(matcher(scholarship)).toBe(false);
  });

  it('should handle null fields gracefully', () => {
    const scholarship = { ...baseScholarship, eligibleMajors: null };
    const matcher = buildMatchingScholarships(baseUser);
    expect(matcher(scholarship)).toBe(true); // 전공 제한이 없으므로 true
  });
});
