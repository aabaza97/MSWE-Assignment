'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface: typeof QueryInterface, Sequelize: typeof DataTypes) {
		await queryInterface.createTable('UserLikes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Users',
					key: 'id',
				},
				onDelete: 'CASCADE',
				foreignKey: true,
				allowNull: false,
			},
			upload_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Uploads',
					key: 'id',
				},
				onDelete: 'CASCADE',
				foreignKey: true,
				allowNull: false,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface: typeof QueryInterface, Sequelize: any) {
		await queryInterface.dropTable('UserLikes');
	},
};
