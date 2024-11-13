'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface UserAttributes {
	first_name: string;
	last_name: string;
	hash: string;
	email: string;
}

module.exports = (sequelize: Sequelize) => {
	class User extends Model<UserAttributes> implements UserAttributes {
		public first_name!: string;
		public last_name!: string;
		public hash!: string;
		public email!: string;

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models: any) {
			// define association here
			// user has many uploads
			User.hasMany(models.Uploads, { foreignKey: 'user_id' });
		}
	}

	User.init(
		{
			first_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			hash: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'User',
		}
	);

	return User;
};
