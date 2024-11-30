const createResponse = require('../../src/utils/responseTemplate');

describe('createResponse', () => {
  it('should return response with success true and data object', () => {
    const data = { key: 'value' };
    const result = createResponse(true, 'Operation successful', data);
    expect(result).toEqual({
      success: true,
      message: 'Operation successful',
      data: data,
    });
  });

  it('should return response with success false and data object', () => {
    const data = { error: 'Invalid input' };
    const result = createResponse(false, 'Operation failed', data);
    expect(result).toEqual({
      success: false,
      message: 'Operation failed',
      data: data,
    });
  });

  it('should return response with data as undefined when data is not provided', () => {
    const result = createResponse(true, 'No data provided');
    expect(result).toEqual({
      success: true,
      message: 'No data provided',
      data: undefined,
    });
  });
});
