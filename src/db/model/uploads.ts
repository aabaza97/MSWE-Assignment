'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface UploadsAttributes {
	name: string;
	type: string;
	user_id: string;
}

module.exports = (sequelize: Sequelize) => {
	class Uploads extends Model<UploadsAttributes> implements UploadsAttributes {
		public name!: string;
		public type!: string;
		public user_id!: string;

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models: any) {
			// define association here
			// user has many uploads
			Uploads.belongsTo(models.User, { foreignKey: 'user_id' });
		}
	}
	Uploads.init(
		{
			name: DataTypes.STRING,
			type: DataTypes.ENUM,
			user_id: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Uploads',
		}
	);
	return Uploads;
};
