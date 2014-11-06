require 'rspec/core/rake_task'
 
$LOAD_PATH.unshift File.dirname(__FILE__)

RSpec::Core::RakeTask.new :specs do |task|
  task.pattern = Dir['spec/**/*_spec.rb']
end
 
task :default => ['specs']

require 'database.rb'
desc 'Setup Database'
task 'db:set' do
  puts 'Setup Database...'
  Database.new.connect.migrate
end
