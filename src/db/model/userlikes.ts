'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface UserLikesAttributes {
	user_id: number;
	upload_id: number;
}

module.exports = (sequelize: Sequelize) => {
	class UserLikes extends Model<UserLikesAttributes> implements UserLikesAttributes {
		public user_id!: number;
		public upload_id!: number;
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models: any) {
			// define association here
			UserLikes.belongsTo(models.User, { foreignKey: 'user_id' });
			UserLikes.belongsTo(models.Uploads, { foreignKey: 'upload_id' });
		}
	}
	UserLikes.init(
		{
			user_id: DataTypes.INTEGER,
			upload_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'UserLikes',
		}
	);
	return UserLikes;
};
