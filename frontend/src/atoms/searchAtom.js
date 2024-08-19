import { atom } from 'recoil';

const searchAtom = atom({
  key: 'searchAtom',
  default: {
    keyword: '',
    result: [],
  },
});

export default searchAtom;
