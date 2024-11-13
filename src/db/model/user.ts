'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface UserAttributes {
	username: string;
	hash: string;
	email: string;
}

module.exports = (sequelize: Sequelize) => {
	class User extends Model<UserAttributes> implements UserAttributes {
		public username!: string;
		public hash!: string;
		public email!: string;

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models: any) {
			// define association here
		}
	}

	User.init(
		{
			username: {
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
