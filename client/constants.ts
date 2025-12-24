import { Course, Module } from './types';
import * as Lessons from './data/lessonContents';

// =========================================================================
// 1. COMPUTER BASICS
// =========================================================================
const COMPUTER_BASICS_MODULES: Module[] = [
  {
    id: 'comp-hardware',
    title: 'ផ្នែករឹង និងការប្រើប្រាស់',
    description: 'ស្គាល់កុំព្យូទ័រ និងរបៀបបញ្ជា។',
    icon: 'Monitor',
    lessons: [
      {
        id: 'what-is-pc',
        title: 'ស្គាល់ផ្នែករឹង (Hardware)',
        content: Lessons.COMP_BASICS_LESSON_1,
        durationMinutes: 10
      },
      {
        id: 'mouse-key',
        title: 'របៀបប្រើ Mouse & Keyboard',
        content: Lessons.COMP_BASICS_LESSON_2,
        durationMinutes: 15
      }
    ]
  },
  {
    id: 'windows-os',
    title: 'ប្រព័ន្ធប្រតិបត្តិការ Windows',
    description: 'ការប្រើប្រាស់ Desktop និង File។',
    icon: 'Layout',
    lessons: [
      {
        id: 'desktop-intro',
        title: 'Desktop និង Start Menu',
        content: Lessons.COMP_BASICS_LESSON_3,
        durationMinutes: 10
      },
      {
        id: 'folder-mgt',
        title: 'ការបង្កើត Folder',
        content: Lessons.COMP_BASICS_LESSON_4,
        durationMinutes: 15
      }
    ]
  },
  {
    id: 'typing-module',
    title: 'របៀបវាយអក្សរ (Typing)',
    description: 'មូលដ្ឋានគ្រឹះនៃការវាយអក្សរនិងដាក់ម្រាមដៃ។',
    icon: 'Keyboard',
    lessons: [
      {
        id: 'typing-skills',
        title: 'ការដាក់ម្រាមដៃ និងវាយអក្សរ',
        content: Lessons.COMP_BASICS_LESSON_5,
        durationMinutes: 20
      }
    ]
  },
  {
    id: 'internet-security',
    title: 'អ៊ីនធឺណិត & សុវត្ថិភាព',
    description: 'របៀបប្រើប្រាស់អ៊ីនធឺណិត និងការពារមេរោគ។',
    icon: 'Globe',
    lessons: [
      {
        id: 'internet-basics',
        title: 'ការប្រើប្រាស់ Internet & Browser',
        content: Lessons.COMP_BASICS_LESSON_6,
        durationMinutes: 20
      }
    ]
  }
];

// =========================================================================
// 2. MICROSOFT WORD
// =========================================================================
const WORD_MODULES: Module[] = [
  {
    id: 'word-module-1',
    title: 'តើអ្វីទៅជា MS Word? ',
    description: 'ស្វែងយល់អំពី Interface និងការកំណត់អក្សរ',
    icon: 'FileText',
    lessons: [
      {
        id: 'word-lesson-1',
        title: '១. និយមន័យនៃ Microsoft Word',
        content: Lessons.WORD_LESSON_1,
        durationMinutes: 15
      },
     {
        id: 'word-lesson-2',
        title: '៣. ប្រវត្តិនៃកម្មវិធី Microsoft Word',
        content: Lessons.WORD_LESSON_2,
        durationMinutes: 15
      },
      {
        id: 'word-lesson-3',
        title: '២. មុខងារសំខាន់ៗ និងគោលបំណង៖',
        content: Lessons.WORD_LESSON_3,
        durationMinutes: 20
      },
    ]
  },
  {
    id: 'word-module-2',
    title: 'របៀបបើកកម្មវិធី',
    description: 'ការរៀបចំអត្ថបទ ការតម្រឹម និងចំណុច',
    icon: 'File',
    lessons: [
      {
        id: 'word-lesson-4',
        title: 'បើកកម្មវិធី',
        content: Lessons.WORD_LESSON_4,
        durationMinutes: 15
      },

    ]
  },
  {
    id: 'word-module-3',
    title: 'Ribbon Tabs',
    description: 'ស្វែងយល់មុខងារសំខាន់ៗនៅក្នុង Tabs នីមួយៗ',
    icon: 'Layout',
    lessons: [
      {
        id: 'word-lesson-10',
        title: '១. អ្វីទៅជា Ribbon Tabs?',
        content: Lessons.WORD_LESSON_10,
        durationMinutes: 15
      },
      {
        id: 'word-lesson-5',
        title: '១. មុខងារដែលមាននៅក្នុង File Tab',
        content: Lessons.WORD_LESSON_5,
        durationMinutes: 15
      },
      {
        id: 'word-lesson-6',
        title: '២. មុខងារដែលមាននៅក្នុង Home Tab',
        content: Lessons.WORD_LESSON_6,
        durationMinutes: 20
      },
      {
        id: 'word-lesson-7',
        title: '៣. មុខងារដែលមាននៅក្នុង Insert Tab',
        content: Lessons.WORD_LESSON_7,
        durationMinutes: 20
      },
      {
        id: 'word-lesson-8',
        title: '៤. មុខងារដែលមាននៅក្នុង Design Tab',
        content: Lessons.WORD_LESSON_8,
        durationMinutes: 20
      },
      {
        id: 'word-lesson-9',
        title: '៤. មុខងារដែលមាននៅក្នុង Layout Tab',
        content: Lessons.WORD_LESSON_9,
        durationMinutes: 20
      },
    ]
    },
    {
    id: 'word-module-4',
    title: 'លំហាត់​អនុវត្ត',
    description: 'ស្វែងយល់មុខងារសំខាន់ៗនៅក្នុង Tabs នីមួយៗ',
    icon: 'Layout',
    lessons: [
      {
        id: 'word-lesson-11',
        title: 'លំហាត់ទី​ ០១',
        content: Lessons.WORD_LESSON_11,
        durationMinutes: 20
      },
      {
        id: 'word-lesson-12',
        title: 'លំហាត់ទី​ ០២',
        content: Lessons.WORD_LESSON_12,
        durationMinutes: 20
      },
      {
        id: 'word-lesson-13',
        title: 'លំហាត់ទី​ ០៣',
        content: Lessons.WORD_LESSON_13,
        durationMinutes: 20
      },
      {
        id: 'word-lesson-14',
        title: 'លំហាត់ទី​ ០៤',
        content: Lessons.WORD_LESSON_14,
        durationMinutes: 20
      },
      {
        id: 'word-lesson-15',
        title: 'លំហាត់ទី​ ០៥',
        content: Lessons.WORD_LESSON_15,
        durationMinutes: 20
      },
      {
        id: 'word-lesson-16',
        title: 'លំហាត់ទី​ ០៦',
        content: Lessons.WORD_LESSON_16,
        durationMinutes: 20
      },
      {
        id: 'word-lesson-17',
        title: 'លំហាត់ទី​ ០៧',
        content: Lessons.WORD_LESSON_17,
        durationMinutes: 20
      },
      {
        id: 'word-lesson-18',
        title: 'លំហាត់ទី​ ០៨',
        content: Lessons.WORD_LESSON_18,
        durationMinutes: 20
      },
      {
        id: 'word-lesson-19',
        title: 'លំហាត់ទី​ ០៩',
        content: Lessons.WORD_LESSON_19,
        durationMinutes: 20
      },
    ]
  },

];

// =========================================================================
// 3. MICROSOFT EXCEL
// =========================================================================
const EXCEL_MODULES: Module[] = [
  {
    id: 'excel-module-1',
    title: 'ផ្នែកទី ១៖ មូលដ្ឋានគ្រឹះនៃ Excel',
    description: 'ការណែនាំអំពី Interface និងការបញ្ចូលទិន្នន័យ',
    icon: 'Table',
    lessons: [
      {
        id: 'excel-lesson-1',
        title: '១. ការណែនាំ និងស្គាល់ Interface',
        content: Lessons.EXCEL_LESSON_1,
        durationMinutes: 15
      },
      {
        id: 'excel-lesson-2',
        title: '២. ការបញ្ចូល និងកែសម្រួលទិន្នន័យ',
        content: Lessons.EXCEL_LESSON_2,
        durationMinutes: 20
      },
      {
        id: 'excel-lesson-3',
        title: '៣. ការប្រើប្រាស់ AutoFill',
        content: Lessons.EXCEL_LESSON_3,
        durationMinutes: 15
      }
    ]
  },
  {
    id: 'excel-module-2',
    title: 'ផ្នែកទី ២៖ រូបមន្តគណនា (Formulas)',
    description: 'ការប្រើប្រាស់រូបមន្តចាំបាច់សម្រាប់ការងារ',
    icon: 'Calculator',
    lessons: [
      {
        id: 'excel-lesson-4',
        title: '១. ការគណនាដោយប្រើសញ្ញា (+ - * /)',
        content: Lessons.EXCEL_LESSON_4,
        durationMinutes: 15
      },
      {
        id: 'excel-lesson-5',
        title: '២. រូបមន្ត SUM និង IF',
        content: Lessons.EXCEL_LESSON_5,
        durationMinutes: 25
      },
      {
        id: 'excel-lesson-6',
        title: '៣. រូបមន្ត AVERAGE និង COUNT',
        content: Lessons.EXCEL_LESSON_6,
        durationMinutes: 20
      },
      {
        id: 'excel-lesson-7',
        title: '៤. រូបមន្ត MAX និង MIN',
        content: Lessons.EXCEL_LESSON_7,
        durationMinutes: 15
      },
      {
        id: 'excel-lesson-lookup',
        title: '៥. រូបមន្ត VLOOKUP និង Text',
        content: Lessons.EXCEL_LESSON_8,
        durationMinutes: 30
      }
    ]
  },
  {
    id: 'excel-module-3',
    title: 'ផ្នែកទី ៣៖ ការតុបតែង និងគ្រប់គ្រង',
    description: 'ការកំណត់ Sort, Filter និង Freeze Panes',
    icon: 'PaintBucket',
    lessons: [
      {
        id: 'excel-lesson-8',
        title: '១. ការកំណត់ប្រភេទលេខ (Number Format)',
        content: Lessons.EXCEL_LESSON_9,
        durationMinutes: 15
      },
      {
        id: 'excel-lesson-10',
        title: '២. Sort, Filter និង Freeze Panes',
        content: Lessons.EXCEL_LESSON_10,
        durationMinutes: 20
      }
    ]
  },
  {
    id: 'excel-module-4',
    title: 'ផ្នែកទី ៤៖ ក្រាហ្វិក & បោះពុម្ព',
    description: 'ការបង្កើត Chart និងកំណត់ Page',
    icon: 'BarChart',
    lessons: [
      {
        id: 'excel-lesson-11',
        title: '១. ការបង្កើតក្រាហ្វិក (Charts)',
        content: Lessons.EXCEL_LESSON_11,
        durationMinutes: 20
      },
      {
        id: 'excel-lesson-12',
        title: '២. Page Layout & Printing',
        content: Lessons.EXCEL_LESSON_12,
        durationMinutes: 15
      }
    ]
  }
];

// =========================================================================
// 4. MICROSOFT POWERPOINT
// =========================================================================
const PPT_MODULES: Module[] = [
  {
    id: 'ppt-module-1',
    title: 'ផ្នែកទី ១៖ មូលដ្ឋានគ្រឹះ PowerPoint',
    description: 'ស្វែងយល់ពី Interface, Layout, និងការរចនា Slide',
    icon: 'Presentation',
    lessons: [
      {
        id: 'ppt-lesson-1',
        title: '១. ការណែនាំ និងអត្ថប្រយោជន៍',
        content: Lessons.PPT_LESSON_1,
        durationMinutes: 20
      },
      {
        id: 'ppt-lesson-2',
        title: '២. Layouts និងការគ្រប់គ្រងផ្នែក (Sections)',
        content: Lessons.PPT_LESSON_2,
        durationMinutes: 20
      },
      {
        id: 'ppt-lesson-3',
        title: '៣. Themes និងការប្តូរពណ៌ផ្ទៃ (Background)',
        content: Lessons.PPT_LESSON_3,
        durationMinutes: 15
      }
    ]
  },
  {
    id: 'ppt-module-2',
    title: 'ផ្នែកទី ២៖ ការរចនា និងបញ្ចូលវត្ថុ',
    description: 'ការប្រើប្រាស់ Textbox, WordArt, និងរូបភាព',
    icon: 'Image',
    lessons: [
      {
        id: 'ppt-lesson-4',
        title: '១. Blank Slide និងការរចនាអក្សរ',
        content: Lessons.PPT_LESSON_4,
        durationMinutes: 20
      },
      {
        id: 'ppt-lesson-5',
        title: '២. រូបភាព (Pictures) និង Shapes',
        content: Lessons.PPT_LESSON_5,
        durationMinutes: 15
      }
    ]
  },
  {
    id: 'ppt-module-3',
    title: 'ផ្នែកទី ៣៖ ចលនា (Motion) និងការបញ្ចាំង',
    description: 'ធ្វើឱ្យបទបង្ហាញមានចលនាជាមួយ Animations និង Morph',
    icon: 'Zap',
    lessons: [
      {
        id: 'ppt-lesson-6',
        title: '១. Slide Transitions & Morph',
        content: Lessons.PPT_LESSON_6,
        durationMinutes: 20
      },
      {
        id: 'ppt-lesson-7',
        title: '២. Animations (ចលនាវត្ថុ)',
        content: Lessons.PPT_LESSON_7,
        durationMinutes: 25
      },
      {
        id: 'ppt-lesson-8',
        title: '៣. ការបញ្ចាំង និងរក្សាទុក (Sharing)',
        content: Lessons.PPT_LESSON_8,
        durationMinutes: 15
      }
    ]
  }
];

// =========================================================================
// 5. MAIN EXPORT
// =========================================================================
export const COURSES: Course[] = [
  {
    id: 'computer-basics',
    title: 'មូលដ្ឋានគ្រឹះកុំព្យូទ័រ',
    description: 'វគ្គសិក្សាសម្រាប់អ្នកចាប់ផ្តើមដំបូងដែលមិនធ្លាប់ប្រើកុំព្យូទ័រ។ រៀនពីរបៀបកាន់ Mouse, វាយអក្សរ និងប្រើប្រាស់ Windows។',
    level: 'កម្រិតដំបូង',
    imageUrl: '/icons/Computer.png',
    color: 'bg-white',
    modules: COMPUTER_BASICS_MODULES
  },
  {
    id: 'ms-word-2021',
    title: 'Microsoft Word 2021',
    description: 'កម្រិតដំបូង៖ សិក្សាពីការប្រើប្រាស់ឧបករណ៍ កំណត់ក្រដាស និងរចនាឯកសាររដ្ឋបាល។',
    level: 'កម្រិតដំបូង',
    imageUrl: '/icons/Word.png',
    color: 'bg-blue-700',
    modules: WORD_MODULES
  },
  {
    id: 'ms-excel-2021',
    title: 'Microsoft Excel 2021',
    description: 'គ្រប់គ្រងទិន្នន័យ តារាង និងរូបមន្តគណនាមូលដ្ឋាន Tune',
    level: 'កម្រិតដំបូង',
    imageUrl: '/icons/Excel.png',
    color: 'bg-green-600',
    modules: EXCEL_MODULES
  },
  {
    id: 'ms-powerpoint-2021',
    title: 'Microsoft PowerPoint 2021',
    description: 'រៀនបង្កើតបទបង្ហាញ (Presentation) ដ៏ទាក់ទាញជាមួយ Slide, Animation និងការរចនាស្អាតៗ Tune',
    level: 'កម្រិតដំបូង',
    imageUrl: '/icons/PowerPoint.png',
    color: 'bg-orange-600',
    modules: PPT_MODULES
  }
];