import { Subject } from './subject';

describe('Subject', () => {
  it('should create an instance', () => {
    expect(new Subject(-1, "")).toBeTruthy();
  });
});
