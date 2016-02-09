import { updateEntry, superMemo2 } from './app'
import { expect } from 'chai'

describe('updateEntry', function() {
    it('should preserve id', function() {
        const e = updateEntry({id:10, foo: 0});
        expect(e.id).to.equal(10);
    });
}); 
