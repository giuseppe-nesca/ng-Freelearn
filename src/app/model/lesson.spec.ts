import { Lesson } from './lesson';

describe('Lesson', () => {
  it('should create an instance', () => {
    expect(new Lesson(-1, -1, -1, "", -1, "", false, -1, -1, "", "")).toBeTruthy();
  });
});
