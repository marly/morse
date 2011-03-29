LETTERS = { 'A' => '.-',   'K' => '-.-',  'U' => '..-',   '4' => '....-',
            'B' => '-...', 'L' => '.-..', 'V' => '...-',  '5' => '.....',
            'C' => '-.-.', 'M' => '--',   'W' => '.--',   '6' => '-....',
            'D' => '-..',  'N' => '-.',   'X' => '-..-',  '7' => '--...',
            'E' => '.',    'O' => '---',  'Y' => '-.--',  '8' => '---..',
            'F' => '..-.', 'P' => '.--.', 'Z' => '--..',  '9' => '----.',
            'G' => '--.',  'Q' => '--.-', '0' => '-----',
            'H' => '....', 'R' => '.-.',  '1' => '.----',
            'I' => '..',   'S' => '...',  '2' => '..---',
            'J' => '.---', 'T' => '-',    '3' => '...--'
          }

SOUND_PATH = File.join(File.dirname(__FILE__), '..', 'public', 'sounds')

class MorseParts
  attr_reader :dit, :dah, :sample_rate
  def initialize(wpm, frequency, sample_rate)
    @dit_time = 1.2/wpm
    @frequency = frequency
    @sample_rate = sample_rate

    @dit = oscillate(@dit_time) + silence(@dit_time)
    @dah = oscillate(3*@dit_time) + silence(@dit_time)
  end

  # Returns a sample of amplitude values between 0 and 255 along a sine wave
  # (128 is effectively 0 for a wav file)
  def oscillate(time)
    (1..sample_times(time)).inject([]) do |samples, n|
      t = 1.0*n/@sample_rate
      omega = 2*Math::PI*@frequency
      samples << ((1 + Math.sin(omega*t))*127).floor + 1
    end
  end

  # Returns a block of rest time for the specified time length 
  def silence(time)
    samples = []
    sample_times(time).times { samples << 128 } 
    samples
  end

  def sample_times(time)
    (1.0*@sample_rate*time).floor
  end

  def make_morse(dahdit_sequence)
    dahdit_sequence.chars.inject([]) do |result,c|
      sequence = (c == '.' ? @dit : @dah)
      result + sequence
    end
  end

end

def size(dahdits)
  dahdits.chars.inject(0) do |sum, current| 
    current == '.' ? sum += 2 : sum += 4 
  end
end

# Generate some mono wave data based on morse frequency information
def generate_wav(letter, m)
  letter_data = m.make_morse(LETTERS[letter])
  samples = letter_data.length
  to_pack = ['RIFF', 28+samples, 'WAVE', 'fmt ', 16, 1, 1, m.sample_rate, 
              m.sample_rate, 1, 8, 'data', 8+samples]
  packed = to_pack.pack('a4Va4A4VvvVVvva4V')

  letter_data.each do |sample|
    to_pack = [sample]
    sample_as_binary = to_pack.pack('C')
    packed += sample_as_binary
  end

  packed
end

# Set up sampling
m = MorseParts.new(20, 1000, 8000)

# Write wav files for all the characters
LETTERS.each do |k, v|
  File.open(File.join(SOUND_PATH, "#{k}.wav"), 'w') { |f| f.write generate_wav(k, m) }
end


