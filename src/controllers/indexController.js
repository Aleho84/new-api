import packageJson from '../../package.json' assert {type: "json"}

export const getIndexPage = (req, res) => {
  res.render('index', { title: packageJson.name.toUpperCase() })
}