import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  // fighter image
  function createPreviewImage(fighter) {
    let imgElement = createElement({
      tagName: 'img',
      className: 'fighter-image___preview',
    });

    if (fighter) {
      const attributes = { src: fighter.source };
      imgElement = createElement({
        tagName: 'img',
        className: 'fighter-image___preview',
        attributes,
      });
    }
    return imgElement;
  }

  //fighter info
  function createPreviewName(fighter) {
    let nameElement = createElement({
      tagName: 'div',
      className: 'fighter-stats',
    });
    if (fighter)
      nameElement.innerText = `Name: ${fighter.name}
    Health: ${fighter.health}
    Attack: ${fighter.attack}
    Defense: ${fighter.defense}`;
    return nameElement;
  }

  let fighterImg = createPreviewImage(fighter);
  let fighterName = createPreviewName(fighter);

  fighterElement.append(fighterImg);
  if (fighter) {
    fighterElement.append(fighterName);
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name,
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
