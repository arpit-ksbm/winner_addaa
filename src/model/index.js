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

module.exports = {
    UserModel,
    PlayerModel,
    VersionControl,
    BoatControl,
    BonusWalletTransactionDetail,
    WalletDetail,
    PromoWalletDetail,
    BonusWalletDetail,
    UserWalletDetail,
    Coupon,
    TournamentModel,
    BannerModel
}