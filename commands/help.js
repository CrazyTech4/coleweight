const PREFIX = "◆"

export function help()
{
    ChatLib.chat("&b--------------[ &a&lColeweight &b]--------------")
    ChatLib.chat(ChatLib.getCenteredText("&a&lInfo"))
    helpCommand("", "Gets Coleweight of specified user", "(username)")
    helpCommand("help", "This menu.", "")
    helpCommand("time", "Prints time on timer (timer gui doesn't have to be visible).", "")
    helpCommand("tick", "Shows tick data.", "(mining speed) (('r','jade', etc) || breaking power of block))")
    helpCommand("leaderboard", "Shows leaderboard.", "(min) [max]")
    helpCommand("info", "Prints coleweight info.", "")
    ChatLib.chat(ChatLib.getCenteredText("&a&lSettings"))
    helpCommand("settings", "Opens settings.", "")
    helpCommand("claim", "Claims a chollows sapphire structure in a lobby.", "(throne || spiral)")
    helpCommand("setkey", "Sets API key (can also use /api new)-", "(key)")
    helpCommand("reload", "Reloads the gui.", "")
    ChatLib.chat(ChatLib.getCenteredText("&a&lWaypoints"))
    helpCommand("coords", "Opens coords gui.", "")
    helpCommand("throne", "Guide for setting up waypoints for throne.", "[toggle]")
    helpCommand("spiral", "Guide for setting up waypoints for spiral", "[toggle]")
    helpCommand("yog", "Shows instructions for yog waypoints.", "[toggle]")
    helpCommand("divans", "Guide for setting up waypoints for Mines of Divan treasures.", "[toggle]")
    ChatLib.chat(ChatLib.getCenteredText("&a&lMiscellaneous"))
    ChatLib.chat(`&a${PREFIX} /fetchdiscord (username) => &bGets discord of username (if linked)`)
    ChatLib.chat("&b------------------------------------------")
}

// Made by Almighty Stylla <3
function helpCommand(command, desc, usage)
{  
    ChatLib.chat(new TextComponent(`&a${PREFIX} /cw ${command} => &b${desc}`).setHoverValue(`${"/cw " + command + " " + usage}`))
}

