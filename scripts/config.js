export default {
    items: [
        {
            typeId: "minecraft:ender_pearl", // Айди предмета
            time: 30, // Задержка (В секундах)
            instantUse: true // Используется ли предмет моментально
        },
        {
            typeId: "minecraft:enchanted_golden_apple",
            time: 120
        },
        {
            typeId: "minecraft:golden_apple",
            time: 30
        },
        {
            typeId: "minecraft:chous_fruit",
            time: 30
        }
    ],
    combat: { // Задержка только при ПвП режиме
        enable: false, // true - включено, false - отключено
        object: "combat" // Объект скорборда
    }
}
