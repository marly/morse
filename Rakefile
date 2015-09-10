task default: %w[build_morse]

desc "Build morse wav files, specify WPM"
task :build_morse, [:wpm] do |t, args|
  args.with_defaults(wpm: 20)
  puts "Generating #{args[:wpm]} WPM .wav files..."
  ruby "lib/make_sound.rb #{args[:wpm]}"
  puts "Done"
end
