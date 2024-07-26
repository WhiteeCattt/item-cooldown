console.warn("Аддон «Зажержки на предметы» успешно загружен!");
import { world, system } from "@minecraft/server";
import config from "./config";

let cooldowns = {};
world.beforeEvents.itemUse.subscribe((data) => {
    const { source: player, itemStack } = data;
    if (player.typeId !== "minecraft:player") return;
    if (config.combat.enabled && getScore(player, config.combat.object) < 1) return;
    for (const item of config.items) {
        if (item.typeId == itemStack.typeId) {
            if (!cooldowns[player.name]) cooldowns[player.name] = {};
            if (!cooldowns[player.name][item.typeId]) cooldowns[player.name][item.typeId] = 0;
            if (cooldowns[player.name][item.typeId] > Date.now()) {
                player.runCommandAsync("title @s actionbar Подождите ещё §e" + ((cooldowns[player.name][item.typeId] - Date.now()) / 1000).toFixed(1) + " сек.");
                data.cancel = true;
            } else {
                if (!item.instantUse) return;
                cooldowns[player.name][item.typeId] = Date.now() + item.time * 1000;
            }
            return;
        }
    }
});

world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source: player }) => {
    if (player.typeId !== "minecraft:player") return;
    if (config.combat.enabled && getScore(player, config.combat.object) < 1) return;
    for (const item of config.items) {
        if (item.typeId == itemStack.typeId) {
            if (!cooldowns[player.name]) cooldowns[player.name] = {};
            if (!cooldowns[player.name][item.typeId]) cooldowns[player.name][item.typeId] = 0;
            cooldowns[player.name][item.typeId] = Date.now() + item.time * 1000;
            return;
        }
    }
});

function getScore(target, objective) {
    try {
        const oB = world.scoreboard.getObjective(objective);
        if (typeof target == "string") return oB.getScore(oB.getParticipants().find((pT) => pT.displayName == target));
        return oB.getScore(target.scoreboardIdentity);
    } catch {
        return 0;
    }
}
