import { showModal } from './modal';

export function showWinnerModal(fighter) {
  // call showModal function
  const showModalOptions = {
    title: 'Winner',
    bodyElement: fighter.name
  }
  showModal(showModalOptions);
}
