/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-else-return */
import StatusUpdate from "./StatusUpdate";
import AccountUpdate from "./AccountUpdate";
import PublishUpdate from "./PublishUpdate";
import MenuUpdate from "./MenuUpdate";
import InfoUpdate from "./InfoUpdate";
import SeatSet from "./SeatSet";

export default function DialogEdit({ open, handleOpen, type }) {
    if (type === 0) {
        // 店況快速更新
        return <StatusUpdate open={open} handleOpen={handleOpen} />;
    } else if (type === 1) {
        // 店況其他設定
        return <SeatSet open={open} handleOpen={handleOpen} />;
    } else if (type === 2) {
        // 設定基本資料
        return <InfoUpdate open={open} handleOpen={handleOpen} />;
    } else if (type === 3) {
        // 設定菜單資料
        return <MenuUpdate open={open} handleOpen={handleOpen} />;
    } else if (type === 4) {
        // 發布設定
        return <PublishUpdate open={open} handleOpen={handleOpen} />;
    } else if (type === 5) {
        // 帳戶設定
        return <AccountUpdate open={open} handleOpen={handleOpen} />;
    }
    return <></>;
}
