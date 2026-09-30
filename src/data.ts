import type { Presentation } from './types/presentation';
import { createPresentation } from './functions/presentation.js';
import { addSlide } from './functions/slide';
import { addObject } from './functions/objects';
import { setSlideBackgroundColor } from './functions/background';

/**
 * Создаёт тестовую презентацию с несколькими слайдами и объектами.
 * Используется для начальной загрузки приложения.
 */
function createTestPresentation(): Presentation {
    let presentation = createPresentation('Тестовая презентация');

    presentation.slides[0] = setSlideBackgroundColor(presentation.slides[0], '#f0f0f0');
    presentation.slides[0] = addObject(presentation.slides[0],
        {
            type: 'text',
            text: 'Добро пожаловать!',
            x: 50,
            y: 50,
            width: 400,
            height: 60,
            fontFamily: 'Arial',
            fontSize: 32,
            fontColor: '#333333'
        });
    presentation.slides[0] = addObject(presentation.slides[0],
        {
            type: 'text',
            text: 'Лабораторная работа #2',
            x: 50,
            y: 120,
            width: 400,
            height: 40,
            fontFamily: 'Arial',
            fontSize: 20,
            fontColor: '#666666'
        });
    


    // Второй слайд
    presentation = addSlide(presentation);
    presentation.slides[1] = setSlideBackgroundColor(presentation.slides[1], '#ffffff');
    presentation.slides[1] = addObject(presentation.slides[1],
        {
            type: 'text',
            text: 'Список задач:',
            x: 50,
            y: 50,
            width: 300,
            height: 40,
            fontFamily: 'Arial',
            fontSize: 24,
            fontColor: '#000000'
        });
    presentation.slides[1] = addObject(presentation.slides[1],
        {
            type: 'text',
            text: '1. Разработать интерфейс',
            x: 50,
            y: 100,
            width: 300,
            height: 30,
            fontFamily: 'Arial',
            fontSize: 18,
            fontColor: '#333333'
        });
    presentation.slides[1] = addObject(presentation.slides[1],
        {
            type: 'text',
            text: '2. Добавить интерактивность',
            x: 50,
            y: 140,
            width: 300,
            height: 30,
            fontFamily: 'Arial',
            fontSize: 18,
            fontColor: '#333333'
        });
    presentation.slides[1] = addObject(presentation.slides[1],
        {
            type: 'text',
            text: '3. Выделить общие компоненты',
            x: 50,
            y: 180,
            width: 300,
            height: 30,
            fontFamily: 'Arial',
            fontSize: 18,
            fontColor: '#333333'
        });

    // Третий слайд
    presentation = addSlide(presentation);
    presentation.slides[2] = setSlideBackgroundColor(presentation.slides[2], '#e8f5e9');
    presentation.slides[2] = addObject(presentation.slides[2],
        {
            type: 'text',
            text: 'Итоги работы:',
            x: 50,
            y: 50,
            width: 300,
            height: 40,
            fontFamily: 'Arial',
            fontSize: 24,
            fontColor: '#2e7d32'
        });
    presentation.slides[2] = addObject(presentation.slides[2],
        {
            type: 'text',
            text: 'Готово!',
            x: 50,
            y: 120,
            width: 200,
            height: 60,
            fontFamily: 'Arial',
            fontSize: 36,
            fontColor: '#4caf50'
        });

    console.log(presentation);
    return presentation;
}


export {
    createTestPresentation,
};
