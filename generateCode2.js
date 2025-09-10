import fs from 'fs'
import path from 'path'

// Конфигурация
const config = {
	excludedDirs: ['node_modules', '.git', 'dist', 'build'],
	excludedFiles: [
		'example.js',
		'config.json',
		'project_code.txt',
		'.gitignore',
		'.dockerignore',
		'cache-life.d.ts',
		'package-lock.json',
		'.next',
		'generateCode.js',
		'generateCode2.js',
		'README.md',
	],
	excludedExtensions: [
		'.svg',
		'.png',
		'.jpg',
		'.jpeg',
		'.webp',
		'.log',
		'.gz',
		'.rscinfo',
		'.old',
		'.ico',
		'.pdf',
		'.dox',
		'.docx',
	],
	outputFile: 'project_code.txt',
}

function shouldExclude(filePath) {
	const ext = path.extname(filePath).toLowerCase()
	const fileName = path.basename(filePath)
	const normalizedPath = filePath.replace(/\\/g, '/')

	// Проверка директорий
	for (const dir of config.excludedDirs) {
		if (
			normalizedPath.includes(`/${dir}/`) ||
			normalizedPath.startsWith(`${dir}/`) ||
			normalizedPath.endsWith(`/${dir}`) ||
			normalizedPath === dir
		) {
			return true
		}
	}

	// Проверка файлов и расширений
	return config.excludedFiles.includes(fileName) || config.excludedExtensions.includes(ext)
}

function processDirectory(directory, output) {
	const normalizedDir = directory.replace(/\\/g, '/')
	if (shouldExclude(normalizedDir)) return

	const files = fs.readdirSync(directory)

	for (const file of files) {
		const fullPath = path.join(directory, file)

		try {
			const stat = fs.statSync(fullPath)

			if (stat.isDirectory()) {
				const dirName = path.basename(fullPath)
				if (config.excludedDirs.includes(dirName)) continue

				if (!shouldExclude(fullPath)) {
					processDirectory(fullPath, output)
				}
			} else {
				if (!shouldExclude(fullPath)) {
					output.push(`----\n${fullPath}\n----\n`)

					try {
						const content = fs.readFileSync(fullPath, 'utf-8')
						output.push(content)
						output.push('\n')
					} catch (err) {
						output.push(`[Error reading file: ${err.message}]\n`)
					}
				}
			}
		} catch (err) {
			console.error(`Error processing ${fullPath}: ${err.message}`)
		}
	}
}

function generateProjectCode(rootDir = '.') {
	const output = []

	if (!fs.existsSync(rootDir)) {
		console.error(`Directory does not exist: ${rootDir}`)
		return
	}

	console.log('Generating project code...')
	console.log(`Excluded directories: ${config.excludedDirs.join(', ')}`)
	console.log(`Excluded files: ${config.excludedFiles.join(', ')}`)
	console.log(`Excluded extensions: ${config.excludedExtensions.join(', ')}`)

	processDirectory(rootDir, output)

	fs.writeFileSync(config.outputFile, output.join(''), 'utf-8')
	console.log(`\nOutput saved to ${config.outputFile}`)
	console.log(`Total files processed: ${output.filter(line => line.startsWith('----')).length}`)
}

// Запуск
generateProjectCode(process.cwd())
