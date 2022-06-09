import { controls } from '../../constants/controls';
import { createElement } from '../helpers/domHelper';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    const healthBarsContainer = document.getElementsByClassName('arena___health-bar');
    const healthBars = [...healthBarsContainer];
    const statusViewContainer = document.getElementsByClassName('arena___health-indicator');
    const statusViews = [...statusViewContainer];
    const statusInfo = {
      block: false,
      currentHealth: 100,
      critCooldown: Date.now(),
      critInput: []
    };
    //consts
    const playerOne = {
      ...firstFighter,
      ...statusInfo,
      healthBar: healthBars[0],
      statusView: statusViews[0],
      position: 'left'
    };

    const playerTwo = {
      ...secondFighter,
      ...statusInfo,
      healthBar: healthBars[1],
      statusView: statusViews[1],
      position: 'right'
    };

    function attackRelease(attacker, defender) {
      if (attacker.block) {
        return undefined;
      }

      if (defender.block) {
        return undefined;
      }

      const totalDamage = getDamage(attacker, defender);

      if (!totalDamage) {
        return undefined;
      }

      defender.currentHealth = defender.currentHealth - (totalDamage / defender.health) * 100;
      if (defender.currentHealth <= 0) {
        document.removeEventListener('keydown', onDown);
        document.removeEventListener('keyup', onUp);
        resolve(attacker);
      }

      defender.healthBar.style.width = `${defender.currentHealth}%`;
    }

    function criticalHitStatus(fighter) {
      const currentTime = Date.now();

      if (currentTime - fighter.critCooldown < 10000) {
        return false;
      }

      if (!fighter.critInput.includes(event.code)) {
        fighter.critInput.push(event.code);
      }

      if (fighter.critInput.length === 3) {
        fighter.critCooldown = currentTime;
        return true;
      }
    }

    function onDown(event) {
      if (!event.repeat) {
        switch (event.code) {
          case controls.PlayerOneAttack: {
            attackRelease(playerOne, playerTwo);
            break;
          }

          case controls.PlayerTwoAttack: {
            attackRelease(playerTwo, playerOne);
            break;
          }

          case controls.PlayerOneBlock: {
            playerOne.block = true;
            break;
          }

          case controls.PlayerTwoBlock: {
            playerTwo.block = true;
            break;
          }
        }

        if (controls.PlayerOneCriticalHitCombination.includes(event.code)) {
          criticalHitStatus(playerOne) ? attackRelease(playerOne, playerTwo) : null;
        }

        if (controls.PlayerTwoCriticalHitCombination.includes(event.code)) {
          criticalHitStatus(playerTwo) ? attackRelease(playerTwo, playerOne) : null;
        }
      }
    }

    function onUp(event) {
      switch (event.code) {
        case controls.PlayerOneBlock:
          playerOne.block = false;
          break;
        case controls.PlayerTwoBlock:
          playerTwo.block = false;
          break;
      }

      if (playerOne.critInput.includes(event.code)) {
        playerOne.critInput.splice(playerOne.critInput.indexOf(event.code), 1);
      }

      if (playerTwo.critInput.includes(event.code)) {
        playerTwo.critInput.splice(playerTwo.critInput.indexOf(event.code), 1);
      }
    }

    document.addEventListener('keydown', onDown);
    document.addEventListener('keyup', onUp);
  });
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  return damage > 0 ? damage : 0;
}

export function getHitPower(fighter) {
  const criticalHitChance = fighter.critInput === 3 ? 2 : Math.random() + 1;
  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  const dodjeChance = Math.random() + 1;
  return fighter.defense * dodjeChance;
}
