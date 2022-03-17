import { Transfer, MsgSendEntity} from "../types";
import { hashToHex } from '@terra-money/terra.js/dist/util';
import { TerraEvent, TerraBlock, TerraMessage, TerraTransaction } from '@subql/types-terra';
import { MsgSend } from "@terra-money/terra.js";


export async function handleBlock(block: TerraBlock) {

}

export async function handleTransaction(tx: TerraTransaction) {

}

export async function handleMessage(msg: TerraMessage) {
    const idx = `${msg.tx.tx.txhash}-${msg.idx}`;
    const msgObj = msg.msg.toData() as MsgSend.Data;
    const msgSendEntity = new MsgSendEntity(idx);
    msgSendEntity.amount = JSON.stringify(msgObj.amount);
    msgSendEntity.toAddress = msgObj.to_address;
    msgSendEntity.fromAddress = msgObj.from_address;
    await msgSendEntity.save();
}

export async function handleEvent(event: TerraEvent) {
    const idx = `${event.tx.tx.txhash}-${event.msg.idx}-${event.idx}`;
    const transfer = new Transfer(idx);
    for(const attr of event.event.attributes) {
        switch(attr.key) {
            case 'sender':
                transfer.sender = attr.value;
                break;
            case 'recipient':
                transfer.recipient = attr.value;
                break;
            case 'amount':
                transfer.amount = attr.value;
                break;
            default:
        }
    }
    await transfer.save();
}
