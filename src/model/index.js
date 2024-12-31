const UserModel = require('./userModel/UserSchema');
const PlayerModel = require('./playerModel/PlayerDetailsSchema');
const VersionControl = require('./VersionControlSchema');
const BoatControl = require('./BoatControlSchema');
const WalletDetail = require('./walletModel/walletDetailSchema');
const PromoWalletDetail = require('./walletModel/promoWalletDetails');
const BonusWalletDetail = require('./walletModel/bonusWalletDetails'); //fsaf
const UserWalletDetail = require('./walletModel/userWalletSchema');
const Coupon = require('./CouponSchema');
const TournamentModel = require('./TournamentSchema');
const BannerModel = require('./BannerSchema');
const Category = require('./CategoryModel');
const NotificationDetail = require('./NotificationSchema');
const PlayerNotification = require('./playerModel/PlayerNotification');
const TeenPattiGame = require('./TeenPattiGameSchema');
const WalletTransactionDetail = require('./walletModel/walletTranscationDetails');
const CouponDetails = require('./CouponDetailSchema');
const PlayerCoupon = require('./playerModel/PlayerCouponSchema');
const GstTds = require('./GstTdsSchema');
const PlayerWinningDetail = require('./playerModel/PlayerWinningDetails');
const TournamentRegistration = require('./TournamentRegistrationSchema');

module.exports = {
    UserModel,
    PlayerModel,
    VersionControl,
    BoatControl,
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
    TeenPattiGame,
    CouponDetails,
    PlayerCoupon,
    GstTds,
    PlayerWinningDetail,
    TournamentRegistration
}