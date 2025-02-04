import constants from "../../util/constants"
import settings from "../../settings"
import { textGui, trackCollection } from "../../util/helperFunctions"
import { BaseGui } from "../BaseGui"
import { registerGui } from "../../guiManager"
import axios from "../../../axios"
import { addNotation, getObjectValue } from "../../util/helperFunctions"

let itemStringed = "",
    trackedItem = "Collection Not set! /cw track",
    itemValues = [],
    uptimeSeconds = 0,
    trackingItem = false,
    apiCallsSinceLastChange = 0,
    calcItemPerHour = false,
    itemValuesSum = 0,
    itemPerHour = 0,
    itemGui = new textGui(),
    currentItem = 0

const collectionGui = new BaseGui(["collectionGui", "collection"], () => {
    let leftValues = [`${itemStringed}`, `${itemStringed}/hr`, `${itemStringed} gained`, "Uptime"]
    if(!settings.collectionTracker || !(settings.showCollectionTrackerAlways || trackingItem || trackedItem == "" || collectionGui.isOpen())) return
    if(itemValues[0] != undefined && calcItemPerHour)
    {
        itemValuesSum = 0
        for(let i = 0; i < itemValues.length; i++)
            itemValuesSum += itemValues[i]
        let eq = Math.ceil((itemValuesSum*(3600/uptimeSeconds)) * 100) / 100
        eq != Infinity ? itemPerHour = eq : itemPerHour = "Calculating..."
        calcItemPerHour = false
    }
    itemGui.x = constants.data.collectionGui.x
    itemGui.y = constants.data.collectionGui.y
    if(settings.collectionNotation)
        itemGui.guiObject = {leftValues: leftValues, rightValues: [addNotation("oneLetters", currentItem) ?? 0, addNotation("oneLetters", itemPerHour) ?? 0, addNotation("oneLetters", itemValuesSum) ?? 0, uptimeSeconds]}
    else
        itemGui.guiObject = {leftValues: leftValues, rightValues: [addCommas(currentItem) ?? 0, addCommas(itemPerHour) ?? 0, addCommas(itemValuesSum) ?? 0, uptimeSeconds]}

    itemGui.renderGui()
}, resetVars)
registerGui(collectionGui)

// thanks to Axl#9999 for most collections in collections.json
export function cguiTrackCollection(collection)
{
    resetVars()
    trackCollection(collection)
    trackedItem = constants.data.tracked.item
    itemStringed = constants.data.tracked.itemStringed
}

register("step", () => {
    let date_ob = new Date(),
     seconds = date_ob.getSeconds()

    if(trackingItem == true)
        uptimeSeconds += 1
    if(seconds == 0 || seconds == 15 || seconds == 30 || seconds == 45)
        calcApi(["members", Player.getUUID().replace(/-/g, ""), "collection"], Player.getUUID())
}).setFps(1)


register("gameLoad", () => {
    if(constants.data.tracked.item != undefined)
    {
        resetVars()
        trackedItem = constants.data.tracked.item
        itemStringed = constants.data.tracked.itemStringed
    }
})


function calcApi(apiPath, tempUuid)
{
    if(trackedItem == "" || constants.data.api_key == "") return
    let profileData = "",
    uuid = ""

    for(let i = 0; i < tempUuid.length; i++)
    {
        if(tempUuid[i] != "-")
            uuid += tempUuid[i]
    }

    try
    {
        axios.get(`https://api.hypixel.net/skyblock/profiles?key=${constants.data.api_key}&uuid=${uuid}`)
        .then(res => {
            for(let i=0; i < res.data.profiles.length; i+=1)
            {
                if(res.data.profiles[i].selected == true)
                    profileData = res.data.profiles[i]
            }
            let source = getObjectValue(profileData, apiPath)[trackedItem]

            if(currentItem == 0 || currentItem == undefined)
            {
                currentItem = source
            }
            else if (trackingItem && (source - currentItem) > 0) // don't track first item because it won't have time tracked.
            {
                itemValues.push(source - currentItem) // for averaging
                calcItemPerHour = true // for deciding when to average the values (don't need to every renderGui)
                trackingItem = true // for rendering gui & timer
                apiCallsSinceLastChange = 0 // for disabling gui at 20
                currentItem = source // current item value
            }
            else if ((source - currentItem) > 0)
            {
                trackingItem = true
                apiCallsSinceLastChange = 0
                currentItem = source
            }
            else if (apiCallsSinceLastChange > 20)
            {
                resetVars()
            }
            else
            {
                apiCallsSinceLastChange += 1
            }
        })
    }
    catch(e) { if(settings.debug) console.log(e)}
}

function resetVars()
{
    currentItem = 0
    itemValues = []
    uptimeSeconds = 0
    trackingItem = false
    apiCallsSinceLastChange = 0
    itemPerHour = "Calculating..."
    itemValuesSum = 0
}