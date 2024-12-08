import fs from 'fs';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'API Documentation',
			version: '1.0.0',
			description: 'API Documentation for the project',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Local server',
			},
		],
	},
	apis: ['./routes/*.js', './models/*.js'], // Adjust the paths according to your project structure
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const setupFor = (docs: any) => swaggerUi.setup(docs);

const combineDocs = (
	baseFolder: string = path.join(__dirname, '../route/v1/docs/'),
	baseFile: string = 'base.docs.config.json',
	outputFile?: string
) => {
	const baseDocsPath = path.join(baseFolder, baseFile);
	const baseDocs = JSON.parse(fs.readFileSync(baseDocsPath, 'utf-8'));

	const combinedDocs = { ...baseDocs, paths: {} };

	console.log(baseDocs.paths.$ref);

	baseDocs.paths.$ref.forEach((refPath: string) => {
		const refFilePath = path.join(baseFolder, refPath.split('#')[0]);
		const refDocs = JSON.parse(fs.readFileSync(refFilePath, 'utf-8'));
		Object.assign(combinedDocs.paths, refDocs.paths);
	});

	const outputPath = path.join(baseFolder, outputFile || baseFile);
	fs.writeFileSync(outputPath, JSON.stringify(combinedDocs, null, 2));
};

combineDocs();

export { swaggerUi, setupFor, swaggerDocs, combineDocs };
