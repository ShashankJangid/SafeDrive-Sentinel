import { ButtonSize } from '../types';

export interface DynamicButtonClasses {
  navBtn: string;
  actionBtn: string;
  primaryBtn: string;
  dangerBtn: string;
  pillBtn: string;
  modalBtn: string;
}

export function getDynamicButtonClasses(size: ButtonSize): DynamicButtonClasses {
  switch (size) {
    case 'glove':
      return {
        navBtn: 'h-11 px-4 text-xs font-bold gap-2',
        actionBtn: 'h-14 px-6 text-sm font-extrabold tracking-wide gap-3 shadow-md',
        primaryBtn: 'h-16 px-8 text-base font-black tracking-wide gap-3 shadow-lg',
        dangerBtn: 'h-16 px-8 text-base font-black tracking-wide gap-3 shadow-lg',
        pillBtn: 'h-11 px-4 text-xs font-bold gap-2',
        modalBtn: 'h-36 p-6 text-2xl font-black gap-4'
      };
    case 'large':
      return {
        navBtn: 'h-10 px-3.5 text-xs font-semibold gap-1.5',
        actionBtn: 'h-12 px-5 text-sm font-bold gap-2 shadow-sm',
        primaryBtn: 'h-13 px-6 text-sm sm:text-base font-extrabold gap-2.5 shadow-md',
        dangerBtn: 'h-13 px-6 text-sm sm:text-base font-extrabold gap-2.5 shadow-md',
        pillBtn: 'h-10 px-3.5 text-xs font-semibold gap-1.5',
        modalBtn: 'h-28 p-5 text-xl font-extrabold gap-3'
      };
    case 'standard':
    default:
      return {
        navBtn: 'h-8 px-2.5 text-xs font-medium gap-1.5',
        actionBtn: 'h-9 px-3.5 text-xs font-semibold gap-1.5 shadow-sm',
        primaryBtn: 'h-10 px-4 text-xs sm:text-sm font-bold gap-2 shadow-sm',
        dangerBtn: 'h-10 px-4 text-xs sm:text-sm font-bold gap-2 shadow-sm',
        pillBtn: 'h-8 px-2.5 text-xs font-medium gap-1.5',
        modalBtn: 'h-22 p-4 text-lg font-bold gap-2.5'
      };
  }
}
