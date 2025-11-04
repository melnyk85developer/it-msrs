import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GLOBAL_PREFIX } from './global-prefix.setup';
import * as fs from 'fs';
import * as path from 'path';

export function swaggerSetup(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('BLOGGER API')
        .addBearerAuth()
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    // const customCss = fs.readFileSync(path.join(process.cwd(), './swagger-dark.css'), 'utf8');
    SwaggerModule.setup(GLOBAL_PREFIX, app, document, {
        customCss: `
            body { 
                background-color: #1e1e1e !important; 
                span {
                    color: #e2e2e2 !important;
                }
                p, h4, .title, span, .tablinks, 
                .opblock-summary-description, 
                .col_header response-col_status, 
                .col_header response-col_description {
                    color: #e2e2e2 !important;
                }
            }
            .swagger-ui .responses-inner, 
            .swagger-ui .responses-inner * {
                color: #e2e2e2 !important;          /* текст */
            }
            .swagger-ui .opblock-section-header { 
                background-color: #222 !important; 
                color: #e2e2e2 !important;
            }
            .swagger-ui .info { color: #e2e2e2 !important; }
            .swagger-ui .markdown p, .swagger-ui .markdown li { color: #e2e2e2 !important; }
            .swagger-ui .scheme-container { background-color: #1e1e1e !important; }

            `,
        customSiteTitle: 'Blogger Swagger',
    });
}