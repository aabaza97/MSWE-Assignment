/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface: any, Sequelize: any) {
		await queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			first_name: {
				type: Sequelize.STRING,
			},
			last_name: {
				type: Sequelize.STRING,
			},
			hash: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable('Users');
	},
};
