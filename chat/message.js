/*
Created 11/11/2022 by Ninjune.
*/
import axios from "../../axios"
import settings from "../settings"
import constants from "../util/constants"
import { addCommas } from "../util/helperFunctions"
const PREFIX = constants.PREFIX
let cwlbData = [],
 newMessage, message, messagePrefix, cwlbPlayerData, onward

register("chat", (level, typeOfChat, hypixelRank, username, playerMessage, event) => { // CW Rank
    if(!settings.rankChat) return
    if(!settings.rankEverywhere && !(constants.serverData.map == "Crystal Hollows" || constants.serverData.map == "Dwarven Mines")) return
    if(!settings.rankEverywhere && typeOfChat != "") return
    onward = true

    playerMessage.split(" ").forEach((chunk) => {
        if (chunk.startsWith("https"))
            onward = false
    })
    if(!onward || cwlbData == undefined) return
    cwlbPlayerData = cwlbData.filter(player => player.name == username)[0]
    if(cwlbPlayerData == undefined) return
    newMessage = new Message()
    message = ChatLib.getChatMessage(event, true),
    messagePrefix = message
    cancel(event)
        
    messagePrefix = message.slice(0, message.indexOf(':')) + ` &8[&6#${addCommas(cwlbPlayerData.rank)}&8]&f: `
    
    newMessage.addTextComponent(messagePrefix)

    if (hypixelRank == "" && typeOfChat == "")
        playerMessage = "&7" + playerMessage.slice(0)
    else
        playerMessage = "&f" + playerMessage.slice(0)
    
    newMessage.addTextComponent(playerMessage)
    ChatLib.chat(newMessage)
}).setCriteria(/^(\[\d+\] )?((?:(?:Guild|Party|Co-op) > )|(?:\[:v:\] ))?(\[\w+\+{0,2}\] )?(\w{1,16})(?: \[\w{1,6}\])?: (.*)$/g)

register("messageSent", (origMessage, event) => { // emotes! this was fun to make :)
    let commandState = 0,
     command = "",
     colonIndex1 = -1,
     message = ""
    
    for(let charIndex = 0; charIndex < origMessage.length; charIndex++)
    {
        if(origMessage[charIndex] == ":" && commandState == 0)
        {
            colonIndex1 = charIndex
            commandState = 1
        }
        else if (origMessage[charIndex] == ":" && commandState == 1)
        {
            commandState = 2
            command = origMessage.slice(colonIndex1 + 1, charIndex).toLowerCase()
        }
    }
    if(command == "shrug")
    {
        cancel(event)
        emote = "¯\\_(ツ)_/¯"
    }
    else if (command == "lenny")
    {
        cancel(event)
        emote = "( ͡° ͜ʖ ͡°)"
    }
    else
        return
    message = origMessage.slice(0, colonIndex1) + emote + origMessage.slice(colonIndex1 + 2 + command.length, origMessage.length)
    ChatLib.say(`${message}`)
})

register("worldLoad", () => {
    axios.get(`https://ninjune.dev/api/coleweight-leaderboard?length=500`)
    .then(res => {
        cwlbData = res.data
    })
    .catch(err => {
        ChatLib.chat(err)
    })
})

export default ""