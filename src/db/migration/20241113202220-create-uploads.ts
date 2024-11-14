'use strict';
const { QueryInterface, DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface: typeof QueryInterface, Sequelize: typeof DataTypes) {
		await queryInterface.createTable('Uploads', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			type: {
				type: Sequelize.ENUM('image', 'video', 'audio', 'document'),
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
			name: {
				type: Sequelize.STRING,
			},
			path: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable('Uploads');
	},
};
