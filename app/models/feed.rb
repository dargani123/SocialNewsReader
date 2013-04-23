class Feed < ActiveRecord::Base
  attr_accessible :uri

  has_many :entries

  def last_entries(n)
  	entries[entries.length-n+1..-1]
  end

  def uri=(uri_)
  	write_attribute(:uri, uri_)
  	entries.build(SimpleRSS.parse(open(uri_)).entries)
  end



end
