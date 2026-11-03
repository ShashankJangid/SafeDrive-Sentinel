import { ButtonSize } from '../types';

export interface DynamicButtonClasses {
  navBtn: string;
  actionBtn: string;
  primaryBtn: string;
  dangerBtn: string;
  pillBtn: string;
  modalBtn: string;
  iconSize: string;
  navIconSize: string;
  mapPuckSize: number;
}

export function getDynamicButtonClasses(size: ButtonSize): DynamicButtonClasses {
  switch (size) {
    case 'glove':
      return {
        navBtn: 'h-12 px-5 text-sm font-extrabold gap-2.5 shadow-md',
        actionBtn: 'h-16 px-7 text-base font-black tracking-wide gap-3.5 shadow-lg',
        primaryBtn: 'h-20 px-10 text-lg font-black tracking-wide gap-4 shadow-xl',
        dangerBtn: 'h-20 px-10 text-lg font-black tracking-wide gap-4 shadow-xl',
        pillBtn: 'h-12 px-5 text-sm font-extrabold gap-2.5',
        modalBtn: 'h-40 p-6 text-3xl font-black gap-5',
        iconSize: 'w-7 h-7',
        navIconSize: 'w-5 h-5',
        mapPuckSize: 72
      };
    case 'large':
      return {
        navBtn: 'h-10 px-3.5 text-xs font-bold gap-2 shadow-sm',
        actionBtn: 'h-12 px-5 text-sm font-bold gap-2.5 shadow-md',
        primaryBtn: 'h-14 px-7 text-base font-extrabold gap-3 shadow-md',
        dangerBtn: 'h-14 px-7 text-base font-extrabold gap-3 shadow-md',
        pillBtn: 'h-10 px-3.5 text-xs font-bold gap-2',
        modalBtn: 'h-32 p-5 text-2xl font-extrabold gap-3.5',
        iconSize: 'w-5 h-5',
        navIconSize: 'w-4 h-4',
        mapPuckSize: 58
      };
    case 'standard':
    default:
      return {
        navBtn: 'h-8 px-2.5 text-xs font-semibold gap-1.5',
        actionBtn: 'h-9 px-3.5 text-xs font-semibold gap-1.5 shadow-sm',
        primaryBtn: 'h-10 px-4 text-xs sm:text-sm font-bold gap-2 shadow-sm',
        dangerBtn: 'h-10 px-4 text-xs sm:text-sm font-bold gap-2 shadow-sm',
        pillBtn: 'h-8 px-2.5 text-xs font-semibold gap-1.5',
        modalBtn: 'h-22 p-4 text-lg font-bold gap-2.5',
        iconSize: 'w-4 h-4',
        navIconSize: 'w-3.5 h-3.5',
        mapPuckSize: 46
      };
  }
}
