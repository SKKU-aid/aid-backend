const createResponse = require('../../src/utils/responseListTemplate');

describe('createResponse (List)', () => {
  it('should return response with success true and data array', () => {
    const result = createResponse(true, 'Operation successful', [1, 2, 3]);
    expect(result).toEqual({
      success: true,
      message: 'Operation successful',
      data: [1, 2, 3],
    });
  });

  it('should return response with success false and default data array', () => {
    const result = createResponse(false, 'Operation failed');
    expect(result).toEqual({
      success: false,
      message: 'Operation failed',
      data: [],
    });
  });

  it('should handle empty data array', () => {
    const result = createResponse(true, 'No data available', []);
    expect(result).toEqual({
      success: true,
      message: 'No data available',
      data: [],
    });
  });
});
