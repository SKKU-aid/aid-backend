const compactScholarship = require('../../src/utils/compactScholarship');

describe('compactScholarship', () => {
  it('should return compact scholarship object with correct fields', () => {
    const scholarship = {
      _id: 1,
      scholarshipName: 'Test Scholarship',
      applicationPeriod: '2023-01-01 ~ 2023-12-31',
      foundation: 'Test Foundation',
      views: 100,
      scholarshipType: 'Type1',
      regionalRestrictions: ['Region1'],
      eligibleMajors: ['Major1', 'Major2'],
      tags: ['Tag1', 'Tag2'],
    };

    const savedScholarshipIDs = [1, 2, 3];

    const result = compactScholarship(scholarship, savedScholarshipIDs);

    expect(result).toEqual({
      scholarshipID: 1,
      scholarshipName: 'Test Scholarship',
      applicationPeriod: '2023-01-01 ~ 2023-12-31',
      foundation: 'Test Foundation',
      views: 100,
      isFav: true,
      tags: ['Tag1', 'Tag2'],
    });
  });

  it('should use defaults when fields are missing', () => {
    const scholarship = {
      _id: 2,
    };

    const savedScholarshipIDs = [];

    const result = compactScholarship(scholarship, savedScholarshipIDs);

    expect(result).toEqual({
      scholarshipID: 2,
      scholarshipName: 'Unknown Scholarship',
      applicationPeriod: 'Unknown Period',
      foundation: 'Unknown Foundation',
      views: 0,
      isFav: false,
      tags: [
        'General',
        '지역무관',
        '전공무관',
      ],
    });
  });

  it('should generate default tags when tags are missing', () => {
    const scholarship = {
      _id: 3,
      scholarshipType: 'Type2',
      regionalRestrictions: ['Region2'],
      eligibleMajors: ['Major3'],
    };

    const savedScholarshipIDs = [3];

    const result = compactScholarship(scholarship, savedScholarshipIDs);

    expect(result).toEqual({
      scholarshipID: 3,
      scholarshipName: 'Unknown Scholarship',
      applicationPeriod: 'Unknown Period',
      foundation: 'Unknown Foundation',
      views: 0,
      isFav: true,
      tags: [
        'Type2',
        'Region2',
        'Major3',
      ],
    });
  });

  it('should set isFav to false when savedScholarshipIDs is empty', () => {
    const scholarship = {
      _id: 4,
      scholarshipName: 'Scholarship 4',
    };

    const result = compactScholarship(scholarship);

    expect(result.isFav).toBe(false);
  });

  it('should set isFav to false when scholarshipID is not in savedScholarshipIDs', () => {
    const scholarship = {
      _id: 5,
      scholarshipName: 'Scholarship 5',
    };

    const savedScholarshipIDs = [1, 2, 3];

    const result = compactScholarship(scholarship, savedScholarshipIDs);

    expect(result.isFav).toBe(false);
  });

  it('should set isFav to true when scholarshipID is in savedScholarshipIDs', () => {
    const scholarship = {
      _id: 6,
      scholarshipName: 'Scholarship 6',
    };

    const savedScholarshipIDs = [6];

    const result = compactScholarship(scholarship, savedScholarshipIDs);

    expect(result.isFav).toBe(true);
  });
});
