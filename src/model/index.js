const UserModel = require('./userModel/UserSchema');
const PlayerModel = require('./playerModel/PlayerDetailsSchema');
const VersionControl = require('./VersionControlSchema');
const BoatControl = require('./BoatControlSchema');
const BonusWalletTransactionDetail = require('./walletModel/bonusWalletDetails');
const WalletDetail = require('./walletModel/walletDetailSchema');
const PromoWalletDetail = require('./walletModel/promoWalletDetails');
const BonusWalletDetail = require('./walletModel/bonusWalletDetails');
const UserWalletDetail = require('./walletModel/userWalletSchema');
const Coupon = require('./CouponSchema');
const TournamentModel = require('./TournamentSchema');
const BannerModel = require('./BannerSchema');
const Category = require('./CategoryModel');
const NotificationDetail = require('./NotificationSchema');
const PlayerNotification = require('./playerModel/PlayerNotification');
const TeenPattiGame = require('./TeenPattiGameSchema');
const WalletTransactionDetail = require('./walletModel/walletTranscationDetails');

module.exports = {
    UserModel,
    PlayerModel,
    VersionControl,
    BoatControl,
    BonusWalletTransactionDetail,
    WalletDetail,
    WalletTransactionDetail,
    PromoWalletDetail,
    BonusWalletDetail,
    UserWalletDetail,
    Coupon,
    TournamentModel,
    BannerModel,
    Category,
    NotificationDetail,
    PlayerNotification,
    TeenPattiGame
}