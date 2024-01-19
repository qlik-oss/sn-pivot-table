import { v4 as uuidv4 } from "uuid";

const getRandomUUID = () => crypto?.randomUUID?.() ?? uuidv4();

export default getRandomUUID;
